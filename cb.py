from chatterbot import ChatBot
import sys

chatbot = ChatBot("Ron Obvious",
	logic_adapters=[
        "chatterbot.adapters.logic.ClosestMatchAdapter",
		"chatterbot.adapters.logic.EvaluateMathematically"
	]);

# Train based on the english corpus
chatbot.train("chatterbot.corpus.english")

arr = (sys.argv)
reply = chatbot.get_response(arr[1])
