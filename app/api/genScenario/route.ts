import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

//create a basic get
export async function POST(req: NextRequest, res: NextResponse) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'I am creating a game for my PSYCH 250: psychology fo the workplace, where the player is hired as an IO psychologist in a startup, then the player has to make decisions in the areas of hiring, leadership , motivation, organizationalCulture and communitcation. now can you generate 10 scenarios ( stricly only reply in JSON) in the mentioned ares where the player has 4 choices each, also include a "correctAnswer"(a number randing from 1 - 4), "category" enum value of the mentioned areas and "reason" keys in the questions object accordingly, please make sure the order of the scenarios are logical and follows a flow. also generate a random startup name and a bit of a summary of what the company does, to give the player context to make decisions. also make sure that the scenarious to some extent make the player to apply certain theories relevant to the psychology of the workplace',
      },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
    stream: false,
  });

  console.log(JSON.parse(completion.choices[0].message.content!));

  return NextResponse.json(JSON.parse(completion.choices[0].message.content!), {
    status: 200,
  });
}
