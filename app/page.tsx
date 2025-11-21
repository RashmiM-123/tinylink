"use client"
import Image from "next/image";

import { useState } from "react";
import Dashboard from "./dashboard/page";

export default function Home() {
  const[longestUrl,setLongestUrl]=useState("")
  const[shorternUrl,setShorternUrl]=useState("")
  
  const handleLongestUrl=(e:any)=>{
       setLongestUrl(e.target.value)
  }
  const handleShorternUrl=()=>{
    
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* <h1>tinylink</h1>

      <input value={longestUrl} onChange={handleLongestUrl} placeholder="Enter Your Url"/>
      <button>
       shortern Link
      </button>
      <div>
        <h1>Short Link</h1>
        <span className="border">{shorternUrl}</span>
      </div> */}
       <Dashboard/>

    </div>
  );
}
