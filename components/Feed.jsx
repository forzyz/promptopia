"use client";

import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText);

    return posts.filter(
      (p) =>
        regex.test(p.creator.username) ||
        regex.test(p.tag) ||
        regex.test(p.prompt)
    );
  };

  // Create a debounced version of handleSearchChange
  const debouncedHandleSearchChange = debounce((value) => {
    console.log(21);
    const searchResult = filterPrompts(value);
    setSearchedResults(searchResult);
  }, 250);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchText(value);

    // Call the debounced function to trigger the debounce effect
    debouncedHandleSearchChange(value);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    debouncedHandleSearchChange(tag);
  };

  const handleProfileClick = (user) => {
    router.push(`/profile/${user._id}?name=${user.username}`)
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchedResults != "" ? searchedResults : posts}
        handleTagClick={handleTagClick}
        handleProfileClick={handleProfileClick}
      />
    </section>
  );
};

export default Feed;
