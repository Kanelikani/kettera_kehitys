import { useState } from "react"
import DogCard from "./components/DogCard"

const dogs = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    bio: "Loves long walks and treats 🦴",
    photo: "https://placedog.net/400/300?id=1"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Husky",
    age: 2,
    bio: "Very talkative and very fluffy ❄️",
    photo: "https://placedog.net/400/300?id=2"
  },
  {
    id: 3,
    name: "Max",
    breed: "Beagle",
    age: 4,
    bio: "Sniffs everything. EVERYTHING.",
    photo: "https://placedog.net/400/300?id=3"
  }
]


function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedDogs, setLikedDogs] = useState([])

  const currentDog = dogs[currentIndex]

  function handleLike() {
    setLikedDogs([...likedDogs, currentDog.id])
    setCurrentIndex(currentIndex + 1)
  }

  function handlePass() {
    setCurrentIndex(currentIndex + 1)
  }

  return (
    <div style={styles.container}>
      <h1>Dog Tinder 🐶</h1>

      {currentDog ? (
        <DogCard
          dog={currentDog}
          onLike={handleLike}
          onPass={handlePass}
        />
      ) : (
        <h2>No more dogs nearby 🐕</h2>
      )}

      <p>Liked dogs: {likedDogs.length}</p>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "2rem"
  }
}

export default App
