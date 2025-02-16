import { db } from '../../services/firebase/server'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method not allowed',
    })
    return
  }

  try {
    const snapshot = await db
      .collection('episodes')
      .orderBy('published', 'desc')
      .get()

    const ref = db.collection('main').doc('live')
    const doc = await ref.get()
    const data = doc.data()

    const episodes = []

    snapshot.forEach((doc) => {
      episodes.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    episodes.sort((a, b) => {
      return new Date(b.published) - new Date(a.published)
    })

    res.status(200).json({ episodes, live: data })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
