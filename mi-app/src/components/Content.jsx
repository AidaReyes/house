import React from 'react'
import ContentHeader from './ContentHeader'
import '../styles/content.css'
import Card from './Card'
const content = () => {
  return (
    <div className='content'>
        <ContentHeader />
        <Card/>
    </div>
  )
}

export default content
