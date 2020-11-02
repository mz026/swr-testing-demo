let data = { name: 'jack' }

async function fetcher () {
  return data
}
async function update(newData) {
  await waitFor(1)
  // data = {
  //   ...data,
  //   ...newData
  // }
}

function waitFor(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, sec * 1000)
  })
}
export { fetcher, update }
