// import {Request, Response, Router} from "express";
// import {app, HTTP_STATUSES} from "../settings";
// import {db} from "../db/db";
// import {ErrorType} from "../types/common";
// import {AvailableResolutions, VideoType} from "../types/video/output";
//
// export const videoRoute = Router({})
//
// videoRoute.get('/', (req: Request, res: Response) => {
//     res.send(db.videos)
// })
//
// videoRoute.get('/:id', (req: Request, res: Response) => {
//     let video: VideoType | undefined = db.videos.find(v => v.id === +req.params.id)
//
//     if (video) {
//         res.send(video)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
//
// videoRoute.post('/', (req: Request, res: Response) => {
//     let errors: ErrorType = {
//         errorsMessages: []
//     }
//
//     let {title, author, availableResolutions} = req.body
//
//     if (!title || !title.trim() || title.length > 40 || typeof (title) !== "string") {
//         errors.errorsMessages.push({message:"Invalid title",field:"title"})
//     }
//
//     if (!author || !author.trim() || author.length > 20 || typeof (author) !== "string") {
//         errors.errorsMessages.push({message:"author is required",field:"author"})
//     }
//
//     if (Array.isArray(availableResolutions)) {
//         availableResolutions.forEach(function(item: typeof AvailableResolutions) {
//             if (typeof item !== 'string' || !AvailableResolutions[item]) {
//                 errors.errorsMessages.push({message: "availableResolutions is required", field: "availableResolutions"})
//             } else {
//                 availableResolutions = []
//             }
//         })
//     }
//
//     if (errors.errorsMessages.length !== 0){
//         res.status(HTTP_STATUSES.BAD_REQUEST_400).send({"errorsMessages": errors.errorsMessages})
//         return // !!!!
//     }
//     let currentDate = new Date();
//     let pubDate = new Date(currentDate.getDate() + 1);
//
//     const newVideo = {
//         id: +(new Date()),
//         title: req.body.title,
//         author: req.body.author,
//         availableResolutions: availableResolutions,
//         canBeDownloaded: false,
//         createdAt: currentDate.toISOString(),
//         minAgeRestriction: null,
//         publicationDate: pubDate.toISOString()
//     }
//     db.videos.push(newVideo)
//     res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
// })
//
// videoRoute.put('/:videoId', (req: Request, res: Response) => {
//     let title = req.body.title
//     let author = req.body.author
//     let availableResolutions = req.body.availableResolutions
//     let canBeDownloaded = req.body.canBeDownloaded
//     let minAgeRestriction = req.body.minAgeRestriction
//     let publicationDate = req.body.publicationDate
//
//     let errors: ErrorType = {
//         errorsMessages: []
//     }
//
//     if (!title || !title.trim() || title.length > 40 || typeof (title
//     ) !== "string") {
//         errors.errorsMessages.push({message:"title is required",field:"title"})
//     }
//     if (!author || !author.trim() || author.length > 20 || typeof (author
//     ) !== "string") {
//         errors.errorsMessages.push({message:"author is required",field:"author"})
//     }
//     if (Array.isArray(availableResolutions)) {
//         availableResolutions.forEach(function(item: typeof AvailableResolutions) {
//             if (typeof item !== 'string' || !AvailableResolutions[item]) {
//                 errors.errorsMessages.push({message: "availableResolutions is required", field: "availableResolutions"})
//             } else {
//                 availableResolutions = []
//             }
//         })
//     }
//     if (!!canBeDownloaded && typeof (canBeDownloaded) !== "boolean") {
//         errors.errorsMessages.push({message:"canBeDownloaded is required",field:"canBeDownloaded"})
//     }
//     if (minAgeRestriction !== null && Number.isNaN(minAgeRestriction) && (minAgeRestriction < 1 || minAgeRestriction > 18)) {
//         errors.errorsMessages.push({message:"minAgeRestriction is required",field:"minAgeRestriction"})
//     }
//     if(typeof(publicationDate) === "string") {
//         function isIsoDate(publicationDate: string) {
//             if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(publicationDate)) return false;
//             const d = new Date(publicationDate);
//             return d instanceof Date && !isNaN(d.getTime()) && d.toISOString()===publicationDate; // valid date
//         }
//         if (!isIsoDate(publicationDate)) {
//             errors.errorsMessages.push({message:"publicationDate is not valid",field:"publicationDate"})
//         }
//     }
//     if (typeof(publicationDate) !== 'string') {
//         errors.errorsMessages.push({message:"publicationDate is not valid",field:"publicationDate"})
//     }
//
//     if (errors.errorsMessages.length !== 0){
//         res.status(HTTP_STATUSES.BAD_REQUEST_400).send({"errorsMessages": errors.errorsMessages})
//     }
//
//     const id = +req.params.videoId
//     const video = db.videos.find(v => v.id === id)
//     if (video) {
//         video.title = title
//         video.author = author
//         video.availableResolutions = availableResolutions
//         video.canBeDownloaded = canBeDownloaded
//         video.minAgeRestriction = minAgeRestriction
//         video.publicationDate = publicationDate ?? video.publicationDate
//         res.status(HTTP_STATUSES.NO_CONTENT_204).send(video)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
//
// videoRoute.delete('/videos/:id', (req: Request, res: Response) => {
//     for (let i = 0; i < db.videos.length; i++) {
//         if (db.videos[i].id === +req.params.id) {
//             db.videos.splice(i, 1)
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//             return;
//         }
//     }
//     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
// })
