import json
lines = []

with open ("./lib/scratch.txt", "r") as fp:
    lines = fp.readlines()

next_verb = None
passing = True
verbs = {}

print("\n\n")

for line in lines:

    if line.startswith("Object") or line == "\n":
        next_verb = None
        passing = True
    
    if line.startswith("Verb"):
        passing = False

    if passing:
        continue

    if line.startswith("id:"):
        next_verb = {"id": line[len("id:")+1:-2].replace("\"", "")}
    if line.startswith("display:"):
        next_verb["display"] = {"en-US": line[len("display:")+1:-3]}
    if (line.startswith("definition:")):

        print("adding:", next_verb)

        next_verb["definition"] = line[len("definition:")+1:-2]
        verbs[next_verb["display"]["en-US"]] = next_verb

for key in verbs.keys():
    verb = verbs[key]

    block = f"""/** 
     *  {verb["definition"]}
     */
    "{verb["display"]["en-US"]}": {"{"}
        "id": "{verb["id"]}",
        "display": {json.dumps(verb["display"])}
    {"}"},"""

    print(block)