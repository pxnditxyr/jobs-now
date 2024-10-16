
import type { ICaptchaData } from '@/interfaces'
import { captchaData } from './captcha-data'

export const getRandomCaptcha = () : ICaptchaData => {
  const randomIndex = Math.floor( Math.random() * captchaData.length )
  return captchaData[ randomIndex ]
}
