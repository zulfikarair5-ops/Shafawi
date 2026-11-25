# Build data/mushaf.json from the quran-qcf4 page JSON (MIT): per line glyph codes, font and ayah runs.
import json,sys
D=sys.argv[1];q=json.load(open(sys.argv[2]));out=sys.argv[3]
FA=[s[3] for s in q['s']]
fonts=[];fi={}
def F(n):
  if n not in fi: fi[n]=len(fonts);fonts.append(n)
  return fi[n]
T={'surah_header':'h','bismillah':'b'}
pages=[];nonseq=0
for p in range(1,605):
  d=json.load(open(f'{D}/pages/{p:03d}.json'));L=[]
  for l in d['lines']:
    ws=l['words'];t=T.get(ws[0]['type'],'l');f=F(ws[0]['font'])
    assert all(w['font']==ws[0]['font'] for w in ws),(p,l['line'])
    codes=[w['code'] for w in ws]
    seq=all(codes[i+1]==codes[i]+1 for i in range(len(codes)-1))
    if not seq: nonseq+=1
    runs=[]
    for w in ws:
      k=w.get('verse_key')
      gi=-1
      if k and w['type'] in('word','end'):
        s,a=map(int,k.split(':'));gi=FA[s-1]+a-1
      if runs and runs[-1][0]==gi: runs[-1][1]+=1
      else: runs.append([gi,1])
    row=[t,f,codes[0],len(codes)] if seq else [t,f,codes]
    if t=='l': row.append(runs)
    if t=='h': row.append(ws[0].get('sura'))
    L.append(row)
  assert len(L)==15 or p<=2,(p,len(L))
  pages.append(L)
json.dump({'src':'quran-qcf4@1.1.0','fonts':fonts,'pages':pages},open(out,'w'),separators=(',',':'))
print('fonts',len(fonts),'nonseq lines',nonseq)
