import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios"
import { API_PATH, BACKEND_URL } from "../../config"

const Signin = () => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/${API_PATH}/user/signin`, {
        username: userName,
        password: passWord
      })
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log("[SIGN_IN_ERROR]", error);

    }
  }


  return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox
          onChange={(e) => {
            setUserName(e.target.value)
          }}
          placeholder="RushikeshShelar" label={"Username"} />
        <InputBox
          onChange={(e) => {
            setPassWord(e.target.value)
          }}
          placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button
            onClick={handleSignIn}
            label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

export default Signin;