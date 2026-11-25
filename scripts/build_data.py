import json,sys,unicodedata
d=json.load(open(sys.argv[1])); out=sys.argv[2]
W=list(d['words']); T=d['mark_types']
pre={};post={}
for pos,t in d['marks']:
  mt=T[t]
  if mt['side']=='before': pre[pos]=pre.get(pos,'')+mt['sign']+' '
  else: post[pos]=post.get(pos,'')+mt['sign']
W=[pre.get(i,'')+w+post.get(i,'') for i,w in enumerate(W)]
def strip(s): return ''.join(c for c in unicodedata.normalize('NFD',s) if not unicodedata.combining(c)).replace('‘',"'").replace('’',"'")
S=[[s['name_ar'],strip(s['name_en']),s['ayah_count'],s['first_ayah']] for s in d['surahs']]
o={'w':W,'ps':d['page_starts'],'ls':d['line_starts'],'as':d['ayah_starts'],'ss':d['surah_starts'],'js':d['juz_starts'],'s':S}
json.dump(o,open(out,'w'),ensure_ascii=False,separators=(',',':'))
print([x[1] for x in S][:20])
