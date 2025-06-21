import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = () =>{
    alert(text)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Background overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

        {/* Centered content */}
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-w-5xl w-[90%] rounded-lg overflow-hidden shadow-2xl p-0 flex flex-col">
          <div className="flex h-[70vh]">
            {/* Image section */}
            <div className="w-1/2 bg-black">
              <img
                src="https://images.unsplash.com/photo-1749498682646-45e7c11506ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info section */}
            <div className="w-1/2 flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link>
                    <Avatar>
                      <AvatarImage src="" alt="user" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="text-semibold text-xs">username</Link>
                    {/* <span>Bio here...</span> */}
                  </div>
                </div>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button
                      aria-label="Open post options"
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreHorizontal className="cursor-pointer" />
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-80 rounded-xl overflow-hidden shadow-xl">
                      <div className="text-center text-sm font-medium divide-y divide-gray-300">
                        <button className="text-red-500 py-3 w-full hover:bg-gray-100 cursor-pointer">
                          Unfollow
                        </button>
                        <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">
                          Add to favorites
                        </button>
                        <Dialog.Close asChild>
                          <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">
                            Cancel
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
              {/* You can add comment list / input / etc. here */}
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                comments
              </div>
              <div className="p-0">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="outline-none text-sm w-full"
                  />
                  <Button variant={'outline'} onClick={sendMessageHandler} disabled={!text.trim()} className="text-[#3BADF8] cursor-pointer border-none ">Send</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <Dialog.Close asChild>
            <button className="py-3 text-sm text-gray-700 hover:bg-gray-100 w-full border-t cursor-pointer">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommentDialog;
