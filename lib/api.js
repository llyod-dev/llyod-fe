
const fetcher = async (url, options) => {
  let response;
  try {
    if (!options) {
      response = await fetch(url);
    } else {
      response = await fetch(url, options);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export { fetcher };
