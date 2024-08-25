import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
// @ts-ignore
import { SignupInput } from "@abhishekpawl/medium-common";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Appbar } from "../components/Appbar";

export const Auth = ({ type }: {
  type: "signup" | "signin"
}) => {
  const navigate = useNavigate()

  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: ""
  })

  async function sendRequest() {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs)
      const jwt = await response.data.jwt
      localStorage.setItem("token", jwt)
      navigate("/")
    } catch (error) {
      // alert
      console.log(error)
      alert("Error while signing up")
    }
  }

  return <div className="flex flex-col h-screen">
    <Appbar />
    <div className="flex-grow bg-slate-200 items-center flex justify-center flex-col">
      <div className="flex justify-center bg-white p-5 rounded-lg shadow-lg">
        <div>
          <div className="text-2xl font-bold text-left mt-4 px-4">
            {type == "signup" ? "Create an account" : "Login"}
          </div>
          <div className="text-slate-400 px-4">
          {type == "signup" ? "Already have an account?" : "Don't have an account?"} {type == "signup" ? <Link className="pl-1 underline" to={"/signin"}>Login</Link> : <Link className="pl-1 underline" to={"/signup"}>Register</Link>}
          </div>
          {type == "signup" ? <InputBox label="Name" placeholder="john doe" type="text" onChange={(e) => {
            setPostInputs({
              ...postInputs,
              name: e.target.value
            })
          }} /> : null}
          <InputBox label="Email" placeholder="john@xyz.com" type="text" onChange={(e) => {
            setPostInputs({
              ...postInputs,
              email: e.target.value
            })
          }} />
          <InputBox label="Password" placeholder="secret" type="password" onChange={(e) => {
            setPostInputs({
              ...postInputs,
              password: e.target.value
            })
          }} />
          <button onClick={() => sendRequest()} type="button" className="text-white w-full mt-8 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{ type == "signup" ? "Sign up" : "Sign in" }</button>
        </div>
      </div>
    </div>
  </div>
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type: string;
  onChange: (e: any) => void;
}

const InputBox = ({ label, placeholder, type, onChange }: LabelledInputType) => {
  return <div className="flex justify-start flex-col mt-2">
    <label htmlFor="inp" className="block mb-2 text-sm font-medium text-black">{ label }</label>
    <input type={ type } id="inp" onChange={ onChange } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={ placeholder } required />
  </div>
}