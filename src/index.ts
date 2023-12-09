import {app} from "./settings"
import {port, runDb} from "./db/db";

const appStart = async () => {
    await runDb()
    app.listen(port, async () => {
        console.log(`app start at port ${port}`)
    })
}

appStart()