import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SondagePage from './pages/SondagePage.jsx'
import QuestionnairePage from './pages/QuestionnairePage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/sondage',
    element: <SondagePage />,
  },
  {
    path: '/sondage/:profile',
    element: <QuestionnairePage />,
  },
  {
    path: '/resultats',
    element: <ResultsPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
