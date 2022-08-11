import React from "react"
import { Link } from "gatsby"

import truncate from "../utils/truncate"
import moment from "moment"

import { FaUser } from "react-icons/fa"

import postplaceholderImage from "../images/post_placeholder.jpg"

const PostCardComponent = ({ link, title, description, postedAt, author }) => {
    return (
        <div className="my-6 md:flex">
            <div className="w-full shrink-0 md:w-48 rounded order-2 md:flex items-center">
                <Link to={`/blog/post/${link}`}>
                    <img className="w-full h-32 object-cover px-4 md:px-0" src={postplaceholderImage} alt="" />
                </Link>
            </div>
            <div className="mx-4 md:mx-8 md:w-full flex flex-col">
                <Link to={`/blog/post/${link}`} className="grow">
                    <h2 className="text-xl font-semibold text-gray-800 my-1">{title}</h2>
                    <p className="text-gray-700 font-thin my-1">{truncate(description, 360)}</p>
                </Link>
                <div className="mt-3 flex items-center gap-2 sm:gap-6 flex-wrap">
                    <Link to={`/blog/post/${link}`}>
                        <span className="text-gray-700 font-thin text-sm"><span>Postado em: </span>{moment(postedAt).format("DD/MM/YYYY hh:mm")}</span>
                    </Link>
                    <Link to={``} className="flex items-center gap-2">
                        <span className="h-6 w-6 flex items-center justify-center">
                            {author.profilePicture ?
                                <img className="w-full h-full object-cotain rounded-full bg-gray-600" src={author.profilePicture} alt={author.username} />
                                : <FaUser className="text-gray-500" />}
                        </span>
                        <span className="text-sm font-thin text-gray-500">{author.username}</span>
                    </Link>
                </div>
                <hr className="my-6 md:mt-2 md:mb-0 border-gray-400 w-full" />
            </div>
        </div>
    )
}


export default PostCardComponent