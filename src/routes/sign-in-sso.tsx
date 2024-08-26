import { useSignIn } from "@clerk/clerk-react"
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors"
import { useState } from "react"

export default function SignInPage() {
  const { signIn } = useSignIn()

  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Uncommenting the following line will fix my issue, but is not recommended
    // if (signIn?.id) (signIn as { id?: string }).id = undefined

    try {
      signIn
        ?.authenticateWithRedirect({
          identifier: email,
          strategy: "saml",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        })
        .catch((error: unknown) => {
          if (isClerkAPIResponseError(error)) {
            setErrors(error.errors)
          }
        })
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        setErrors(e.errors)
      }
    }
  }

  return (
    <div>
      <h1>Sign In SSO</h1>
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

        <button name="submit" type="submit">
          Submit
        </button>
      </form>
      <ul>
        {errors.map(error => (
          <li key={error.code}>{error.longMessage}</li>
        ))}
      </ul>
    </div>
  )
}
