import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Rolls from './pages/Rolls'
import CreateRoll from './pages/CreateRoll'
import RollDetails from './pages/RollDetails'
import PublicLayout from './layouts/PublicLayout'
import JournalLayout from './layouts/JournalLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<JournalLayout />}>
          <Route path="/journal-rolls" element={<Rolls />} />
          <Route path="/journal-rolls/new" element={<CreateRoll />} />
          <Route path="/journal-rolls/:id" element={<RollDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
