import { useState, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const [newQuestion, setNewQuestion] = useState('')
  const { questions, title } = useRoom(roomId)
  
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    if(newQuestion.trim() === '') {
      toast.error('Conteúdo da pergunta não pode ficar em branco.')
      return
    }

    if(!user) {
      toast.error('Você deve estar logado(a) para continuar.')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`/rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
    toast.success('Pergunta postada com sucesso!')
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="questions-list">
          {questions.map(question => {
            return(
              <Question
                content={question.content}
                author={question.author}
                key={question.id}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}