import './App.css'
import { SsoAuthWrapper } from './components/SsoAuthWrapper'
import { ReferralPage } from './pages/ReferralPage'

function App() {
  return (
    <SsoAuthWrapper>
      <ReferralPage />
    </SsoAuthWrapper>
  )
}

export default App
