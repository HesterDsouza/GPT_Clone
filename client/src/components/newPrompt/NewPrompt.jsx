import { useEffect, useRef, useState } from "react";
import "./newPrompt.css"
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = (data) => {

  const urlEndPoint = import.meta.env.VITE_IMGAGE_KIT_ENDPOINT || "https://ik.imagekit.io/xbbenntwoc";
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error:"",
    dbData:{},
    aiData: {}
  })

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "" }]
      },
      {
        role: "model",
        parts: [{ text: "" }]
      },
    ],
    generationConfig:{
      // maxOutputTokens: 100,
    }
  })
  
  const endRef = useRef(null);
  const formRef = useRef(null);

  const imgPath = img.dbData?.filePath;

  useEffect(()=>{
    endRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  },[data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data.data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
        // , image: imgPath, question: question, answer
      }).then(res=>res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat", data.data._id] }).then(() => {
        formRef.current.reset()
        setQuestion("")
        setAnswer("");
        setImg({
          isLoading: false,
          error:"",
          dbData:{},
          aiData: {}}          
        );
      });
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const add = async (text, isInitial)=>{
    if(!isInitial){
      setQuestion(text)
    }
    try { 
        const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
        let accumalatedText = "";
        for await (const chunk of result.stream){
          accumalatedText += chunk.text();
          setAnswer(accumalatedText);
        }

        mutation.mutate()
      } catch (error) {
        console.log(error)
      }
    }

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const text = e.target.text.value;
    if(!text) return;

    add(text, false);
    // e.target.reset();
  }

  // NOT NEEDED IN PRODUCTION 
  const hasRun = useRef(false);

  useEffect(()=>{
    if(!hasRun.current){
      if(data?.history?.length === 1){
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  },[])

  return (
    <div className="newPrompt">
      {img.isLoading && <div>Loading...</div>}
      {imgPath && imgPath.trim() !== "" ? (
        <IKImage
          urlEndpoint={urlEndPoint}
          path={imgPath}
          transformation={[{width: 380}]}
        />
      ) : ""}
      {question && <div className="message user">{question}</div>}
      {answer && (<div className="message"><Markdown>{answer}</Markdown></div>)}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <Upload setImg={setImg}/>
          <input id="file" type="file" multiple={false} hidden/>
          <input type="text" name="text" placeholder="Ask me anything..."/>
          <button>
              <img src="/arrow.png" alt="" />
          </button>
      </form>
    </div>
  )
}

export default NewPrompt