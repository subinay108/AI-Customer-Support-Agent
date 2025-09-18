import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div>
      <Link to='/login'>
        <Button>Login</Button>
      </Link>
    </div>
  )
}

export default HomePage