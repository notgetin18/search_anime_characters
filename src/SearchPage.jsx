import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";
import { FixedSizeList as List } from "react-window";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [has_next_page, setHas_next_page] = useState(1);
  const [current_page, setcurrent_page] = useState(1);
  const [responseCode, setResponseCode] = useState("OK");

  const handleSearch = async () => {
    const response = await axios.get(
      `https://api.jikan.moe/v4/characters?page=${page}&limit=15&q=${query}&order_by=favorites&sort=desc`
    );
    if (response.statusText === "OK") {
      setResponseCode(response.statusText); //In case of Failure of Api
      setResults(response.data.data); // settiing api data
      setTotalCharacters(response.data.pagination.items.total); // To display how many similar caharcters found on your search
      setHas_next_page(response.data.pagination.has_next_page);
      setPage(response.data.pagination.current_page); //setting page number to activate and disables Next or Back button
      setcurrent_page(response.data.pagination.current_page); //setiing current page for pagination
    } else {
      setErrorMessage("Some Technical issue, please try after sometime"); //custom error message to display while API failed to load data
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query, page]);

  return (
    <div>
      {responseCode === "OK" ? (
        <div>
          <input
            className="input-001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="h1-01">
            <b>
              {totalCharacters === 153834
                ? `Total Anime Characters are ${Intl.NumberFormat(
                    "en-IN"
                  ).format(totalCharacters)}`
                : `Total ${Intl.NumberFormat("en-IN").format(
                    totalCharacters
                  )} matching online Characters found out of 1,53,834`}
            </b>
          </p>
          {results.length === 0 && (
            <p>No results found for your Search, please try with other name</p>
          )}
          <div className="box-002">
            <div className="box-001">
              {results.slice(0, 15).map((character) => (
                <div key={character.mal_id} className="character-box">
                  <div className="inner-box3">
                    <div className="inner-box1">
                      <img
                        src={character.images.jpg.image_url}
                        alt="Anime_image"
                        className="img-001"
                      />
                      <div className="inner-box2">
                        <p className="p1">{character.name}</p>

                        {character.nicknames.length === 0 ? (
                          ""
                        ) : (
                          <p className="p2">
                            <List
                              width={"100%"}
                              height={150}
                              itemCount={character.nicknames.length}
                              itemSize={30}
                              itemData={character.nicknames}
                            >
                              {({ index, style, data }) => (
                                <div
                                  key={data[index]}
                                  style={style}
                                  className="dd"
                                >
                                  <p className="p4">{data[index]}</p>
                                </div>
                              )}
                            </List>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="inner-box4">
                      <p className="p5">
                        <b>
                          <span className="span-002">❤</span>
                          {character.favorites}
                        </b>
                      </p>
                      <span className="span-001">
                        {
                          <AiOutlineArrowRight
                            onClick={() => {
                              window.open(`${character.url}`);
                            }}
                          />
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pagination">
                {current_page === 1 ? (
                  <button disabled>⏮Back</button>
                ) : (
                  <button onClick={() => setPage(page - 1)}>⏮Back</button>
                )}
                {has_next_page === true ? (
                  <button onClick={() => setPage(page + 1)}>⏭Next </button>
                ) : (
                  <button disabled>⏭Next </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        errorMessage
      )}
    </div>
  );
};

export default SearchPage;
