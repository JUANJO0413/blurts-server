'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const csrf = require('csurf')

const {
  home, getAboutPage, getAllBreaches, getBentoStrings,
  getSecurityTips, notFound, addEmailToWaitlist, testSentry
} = require('../controllers/home')
const { getIpLocation } = require('../controllers/ip-location')

const { getShareUTMs, requireSessionUser } = require('../middleware')

const csrfProtection = csrf()
const jsonParser = bodyParser.json()
const router = express.Router()

router.get('/', csrfProtection, home)
router.get('/share/orange', csrfProtection, getShareUTMs, home)
router.get('/share/purple', csrfProtection, getShareUTMs, home)
router.get('/share/blue', csrfProtection, getShareUTMs, home)
router.get('/share/:breach', csrfProtection, getShareUTMs, home)
router.get('/share/', csrfProtection, getShareUTMs, home)
router.get('/about', getAboutPage)
router.get('/breaches', getAllBreaches)
router.get('/security-tips', getSecurityTips)
router.get('/getBentoStrings', getBentoStrings)
router.post('/join-waitlist', jsonParser, requireSessionUser, addEmailToWaitlist)
router.get('/iplocation', getIpLocation)
router.get('/test-sentry', requireSessionUser, testSentry)
router.use(notFound)

module.exports = router
