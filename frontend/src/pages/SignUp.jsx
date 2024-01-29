import { useState } from "react"

import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { API_PATH, BACKEND_URL} from "../../config"
import { useNavigate } from "react-router-dom"



const Signup = () => {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [email, setEmail] = useState("");

  // console.log(firstName, lastName, userName, passWord);

  const resetState = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setPassWord("");
    setEmail("");
  }

  const handleSignUp = async () => {
    // console.log(`${BACKEND_URL}/${API_PATH}/signup`);
    const response = await axios.post(`${BACKEND_URL}/${API_PATH}/user/signup`, {
      firstName: firstName,
      lastName: lastName,
      username: userName,
      password: passWord,
      email: email
    });
    
    localStorage.setItem("token", response.data.token);
    resetState(); 
    navigate("/dashboard");
    
  }

  return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={(e) => {
          setFirstName(e.target.value)
        }}
          placeholder="Rushikesh"
          label={"First Name"} />
        <InputBox onChange={(e) => {
          setLastName(e.target.value)
        }}
          placeholder="Shelar"
          label={"Last Name"} />
        <InputBox
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          placeholder="Rushi@gmail.com"
          label={"Email"} />
        <InputBox onChange={(e) => {
          setUserName(e.target.value)
        }}
          placeholder="rushikeshShelar"
          label={"Username"} />
        <InputBox onChange={(e) => {
          setPassWord(e.target.value)
        }}
          placeholder="123456"
          label={"Password"} />
        <div className="pt-4">
          <Button onClick={handleSignUp}
            label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
};

export default Signup;