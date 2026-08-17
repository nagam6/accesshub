import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  function toggleFavorite(place) {
    setFavorites((current) => {
      const alreadyFavorite = current.some(
        (item) => item.id === place.id
      )

      if (alreadyFavorite) {
        return current.filter(
          (item) => item.id !== place.id
        )
      }

      return [...current, place]
    })
  }

  function isFavorite(placeId) {
    return favorites.some(
      (item) => item.id === placeId
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}