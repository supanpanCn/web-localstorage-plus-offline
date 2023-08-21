import MagicString from "magic-string";
import helper from './helper';

const placeholder = "__OFFLINE_MODE__";
const parenthesis = ["(", ")"];
const brackets = ["{", "}"];
const ms = 100;

function extractOnMounted(code: string) {
  let i = code.lastIndexOf("onMounted");
  const initialIndex = i;
  if (i > -1) {
    i++;
    while (code[i] !== parenthesis[0]) {
      i++;
    }
    if (code[i] === parenthesis[0]) {
      i++;
      return helper.extract(code, code.substring(initialIndex, i), i, parenthesis);
    }
  }
}

function overwriteOnMounted(id:string,code?: string) {
  const response = {
    injectTo: "append",
    body: "",
  };
  if (code) {
    let i = code.indexOf(brackets[0]);
    if (i > -1) {
      i++;
      const originBody = helper.extract(code, code.substring(0, i), i, brackets);
      const s = helper.str(originBody);
      s.appendLeft(originBody.length-1,`import('web-localstorage-plus').then(mod=>{
        const timer = setTimeout(()=>{
            const storage = mod.useStorage();
            storage.online('${id}')
            clearTimeout(timer)
        },${ms})
      })\n`);
      response.body = s.toString()+')'
      response.injectTo = 'replace'
    }
  }
  return response as {
    injectTo:'replace'|'append',
    body:string
  };
}

function setIntoPage(payload:ReturnType<typeof overwriteOnMounted>,s:MagicString,id:string,oldBody:string=''){
    if(payload.injectTo === 'replace'){
        s.replace(oldBody,payload.body)
    }else if(payload.injectTo === 'append'){
        const code = s.toString()
        const i = code.indexOf('</script')
        if(i>-1){
            s.appendLeft(i,`import('vue').then(vueMod=>{
                import('web-localstorage-plus').then(storageMod=>{
                    const timer = setTimeout(()=>{
                        const storage = storageMod.useStorage();
                        storage.online('${id}')
                        clearTimeout(timer)
                    },${ms})
                })
            });\n`)
        }
    }
    return s
}

export default function enhanceVueComponent(s: MagicString, id: string) {
  const code = s.toString();
  if (code.indexOf(placeholder) > -1) {
    s.replaceAll(placeholder, id);
    const body = extractOnMounted(code);
    const payload = overwriteOnMounted(id,body);
    return setIntoPage(payload,helper.str(s.toString()),id,body)
  }
  return s
}
