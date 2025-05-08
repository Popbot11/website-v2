import json
import os
from datetime import datetime

with open('./content/index.json', 'r+') as indexfile:
    indexdata = json.load(indexfile)
    
    indexdata = dict(sorted(indexdata.items(), key=lambda x: 
                    (''.join(c for c in x[1]['date'] if not c.isalpha())), 
                    reverse=True))
    indexfile.seek(0)
    json.dump(indexdata, indexfile, indent=4)
    print("\sorted index.json")

    