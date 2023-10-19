import axios from "axios";
import "./home.css";
import { useEffect, useState } from "react";
import { api_config, base_Url } from "./api";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";

const Home = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [search, setSearch] = useState([]);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("hi");

  const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const search_input = document.querySelector(".search_input");
  const result_area = document.querySelector(".result_Container");
  if (search_input && result_area) {
    search_input.addEventListener("click", () => {
      result_area.style.opacity = "1";
    });
  } else {
    console.error("Could not find search_input or result_Container elements");
  }

  const fetchLanguages = async () => {
    try {
      const { data } = await axios.get(`${base_Url}/getLanguages`, api_config);
      setSearch(data.data.languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const filterSearch = search.filter((data) =>
    data.name.toLowerCase().includes(language.toLowerCase())
  );

  const translate = async () => {
    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", "en");
    encodedParams.set("target_language", code);
    encodedParams.set("text", text);
    try {
      const { data } = await axios.post(
        `${base_Url}/translate`,
        encodedParams,
        api_config
      );
      setTranslatedText(data.data.translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  useEffect(() => {
    translate();
    fetchLanguages();
  }, [text, code]);

  return (
    <div className="container">
      <div className="search_container">
        <div className="search_Box" style={center}>
          <div className="search_area" style={center}>
            <input
              className="search_input"
              type="text"
              placeholder="search Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <SearchIcon className="search_logo" />
          </div>
        </div>
        <div className="result_Container" style={center}>
          <div className="result">
            {filterSearch.map((language, index) => (
              <div
                key={index}
                className="search"
                onClick={() => {
                  setCode(language.code);
                  setLanguage(language.name);
                  result_area.style.opacity = "0";
                }}
              >
                <span>{language.name}</span>
                <span>{language.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Box
        className="output_container"
        sx={{ ...center, width: "100%", height: "100%" }}
      >
        <textarea
          className="textarea"
          placeholder="Enter text to translate"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Translation"
          value={translatedText}
        />
      </Box>
    </div>
  );
};

export default Home;
