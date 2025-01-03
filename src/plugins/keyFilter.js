/* eslint-disable no-console */
const keyFilter = (event, type, lang) => {
    const allowedArrowsAndKeys = [8, 37, 39]
    const supportRules = ['All', 'number', 'En', 'Th', 'Group', 'GroupTh']
    const stopEvent = () => {
      if (event) event.preventDefault()
      if (event) event.stopPropagation()
  
      return null
    }
    const regexThEn = () => {
      if (['All'].includes(type)) return /[0-9ก-์A-z/, -]/
      if (['En'].includes(type)) return /[A-z .]/
      if (['Th'].includes(type)) {
        return (e) => {
          // ตรวจสอบว่าเป็น Tab Key หรือไม่
          if (e.key === "Tab") return true; // อนุญาตให้ Tab ทำงานปกติ
          // ใช้ RegEx สำหรับอักขระไทยและช่องว่าง
          if (!/[ก-์ ]/.test(e.key)) {
            e.preventDefault(); // บล็อกอักขระที่ไม่ผ่าน RegEx
          }
        };
      }      
      if (['Group'].includes(type)) return  /[0-9A-z '/.-]/
      if (['GroupTh'].includes(type)) return  /[0-9ก-์ /.-]/
      if (type === 'number') return /[0-9]/
  
      return null
    }
  
    const regex = () => {
      if (lang === 'th') return regexThEn()
      return regexThEn()
    }
  
    if (type == null) return console.log('event, type required')
    if (!supportRules.includes(String(type))) return null
    if (allowedArrowsAndKeys.includes(event.keyCode)) return null
    if (!regex().exec(event.key)) stopEvent()
  
    return null
  }
  
  export default keyFilter
  