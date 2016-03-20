from chatterbot import ChatBot
import sys

chatbot = ChatBot("Ron Obvious",
	logic_adapters=[
        "chatterbot.adapters.logic.ClosestMatchAdapter",
		"chatterbot.adapters.logic.EvaluateMathematically"
	]);

messages = open('logs/messages').read().split(',')
length = len(messages) - 1
del messages[length]

# Train based on the english corpus
chatbot.train("chatterbot.corpus.english")

# Train based on the conversation of people
chatbot.train(messages)

arr = (sys.argv)
reply = chatbot.get_response(arr[1])
