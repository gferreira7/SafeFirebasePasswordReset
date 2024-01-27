import { useEffect, useState } from "react";

function useLocationHash() {
  const getParsedQueryParams = function () {
    const urlParams = new URLSearchParams(window.location.search);
  
    // Log the 'mode' parameter for debugging
    const mode = urlParams.get('mode');
    console.log("Mode:", mode); // Should log 'resetPassword' or other modes
  
    // Parse the query parameters into key/value pairs
    const parsedQueryParams: { [key: string]: string } = {};
    urlParams.forEach((value, key) => {
      parsedQueryParams[key] = value;
    });
  
    console.log("Parsed Query Params: ", parsedQueryParams);
    return parsedQueryParams;
  }

  //set up the location hash params on load
  const [locationHash, setLocationHash] = useState(getParsedQueryParams());

  //...and update them every time they change
  useEffect(() => {
    const handleHashChange = () => setLocationHash(getParsedQueryParams());

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return locationHash;
}

export default useLocationHash;
