from chatterbot import ChatBot
import sys

chatbot = ChatBot("Ron Obvious")

# Train based on the english corpus
chatbot.train("chatterbot.corpus.english")

arr = (sys.argv)
reply = chatbot.get_response(arr[1])
