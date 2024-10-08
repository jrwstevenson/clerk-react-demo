import { useSignIn } from "@clerk/clerk-react"
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function SignInPage() {
  const { signIn } = useSignIn()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("123")
  const [errors, setErrors] = useState([])
  const [SSOError, setSSOError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn?.create({ identifier: email, password })
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        setErrors(e.errors)
        if (e.errors.some(error => error.longMessage?.toLocaleLowerCase().includes("saml"))) {
          setSSOError(true)
        } else {
          setSSOError(false)
        }
      }
    }
  }

  return (
    <div>
      <h1>Sign In</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          padding: "20px",
        }}
      >
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <button name="submit" type="submit">
          Submit
        </button>
      </form>
      <ul>
        {errors.map(error => (
          <li key={error.code}>{error.longMessage}</li>
        ))}
      </ul>
      {SSOError && <Link to="/sign-in-sso">Click here to login with SSO</Link>}
    </div>
  )
}
