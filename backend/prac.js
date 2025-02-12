const users = [
    {
      "user_id": "qh441TWnBH",
      "username": "Jignesh",
      "preferred_language": "es",
      "email": "Jignesh@gmail.com",
      "password": "123"
    },
    {
      "user_id": "g0hukGm3bf",
      "username": "Sahil",
      "preferred_language": "en",
      "email": "Sahil@gmail.com",
      "password": "345"
    }
  ]

 users.map((item, index) => (
    Object.entries(item).map(([key, value]) => (
      console.log(value)
    ))
  ))