import React from 'react'
import HeroSection from '../components/HeroSection'
import UpcomingTournaments from '../components/UpcomingTournaments'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <UpcomingTournaments />
      <Footer />
    </div>
  )
}

export default Home