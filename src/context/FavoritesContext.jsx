import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc
} from 'firebase/firestore'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  auth,
  db
} from '../firebase/firebase'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [loadingFavorites, setLoadingFavorites] =
    useState(true)

  function getPlaceId(place) {
    return String(
      place.firestoreId ??
      place.id
    )
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setFavorites([])
          setLoadingFavorites(false)
          return
        }

        try {
          setLoadingFavorites(true)

          const snapshot = await getDocs(
            collection(
              db,
              'users',
              user.uid,
              'favorites'
            )
          )

          const loadedFavorites = []

          for (const favoriteDoc of snapshot.docs) {
            const favoriteData =
              favoriteDoc.data()

            const placeId = String(
              favoriteData.placeId
            )

            const placeSnapshot =
              await getDoc(
                doc(
                  db,
                  'places',
                  placeId
                )
              )

            if (placeSnapshot.exists()) {
              loadedFavorites.push({
                firestoreId:
                  placeSnapshot.id,

                ...placeSnapshot.data(),
              })
            }
          }

          setFavorites(loadedFavorites)
        } catch (error) {
          console.error(
            'Error loading favorites:',
            error
          )

          setFavorites([])
        } finally {
          setLoadingFavorites(false)
        }
      }
    )

    return unsubscribe
  }, [])

  async function toggleFavorite(place) {
    const user = auth.currentUser

    if (!user) {
      alert(
        'Please log in to save places to your favorites.'
      )
      return
    }

    const placeId = getPlaceId(place)

    if (
      !placeId ||
      placeId === 'undefined'
    ) {
      console.error(
        'Place has no valid ID:',
        place
      )

      alert(
        'This place could not be saved because its ID is missing.'
      )

      return
    }

    const favoriteRef = doc(
      db,
      'users',
      user.uid,
      'favorites',
      placeId
    )

    const alreadyFavorite =
      favorites.some(
        (item) =>
          getPlaceId(item) === placeId
      )

    try {
      if (alreadyFavorite) {
        await deleteDoc(favoriteRef)

        setFavorites((current) =>
          current.filter(
            (item) =>
              getPlaceId(item) !== placeId
          )
        )

        return
      }

      await setDoc(
        favoriteRef,
        {
          placeId,
          savedAt:
            new Date().toISOString(),
        }
      )

      setFavorites((current) => [
        ...current,
        place,
      ])
    } catch (error) {
      console.error(
        'Error updating favorite:',
        error
      )

      alert(
        'Could not update your favorites.'
      )
    }
  }

  function isFavorite(placeId) {
    return favorites.some(
      (item) =>
        getPlaceId(item) ===
        String(placeId)
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loadingFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}