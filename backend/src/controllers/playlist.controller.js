import { db } from "../libs/db.js";

export const createPlaylist = async(req, res)=>{
    try {
        const {name , description} = req.body;

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success:true,
            message:"Playlist Created Successfully",
            playlist
        })

    } catch (error) {
        console.log("Error While Creating Playlist", error);
        res.status(500).json({
            error:"Error While Creating Playlist"
        })
    }
}

export const getAllListDetails = async(req, res)=>{
    try {
        const playlist = await db.playlist.findMany({
            where:{
                userId: req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem: true
                    }   
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Playlists Fetched Successfully",
            playlist
        })
    } catch (error) {
        console.log("Error While Fetching Playlists", error);
        res.status(500).json({
            error:"Error While Fetching Playlists"
        })
    }
}

export const getPlayListDetails = async(req, res)=>{
    const {playlistId} = req.params;
    try {
        const playlist = await db.playlist.findUnique({
            where:{
                id: playlistId,
                userId: req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem: true
                    }   
                }
            }
        });
        if(!playlist){
            return res.status(404).json({
                error:"Playlist not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Playlist Fetched Successfully",
            playlist
        })
    } catch (error) {
        console.log("Error While Fetching Playlist", error);
        res.status(500).json({
            error:"Error While Fetching Playlist"
        })
    }
}

export const addProblemToPlaylist = async(req, res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body
    
    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({
                error:"Invalid problemIds"
            })
        }
        
        // create records for each problems in the playlist
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId)=>({
                playlistId,
                problemId
            }))
        })

        res.status(201).json({
            success : true,
            message : "Problems added to playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.log("Error While Adding Problems to Playlist", error);
        res.status(500).json({
            error:"Error While Adding Problems to Playlist"
        })
    }
}

export const deletePlaylist = async(req, res)=>{
    const {playlistId} = req.params;
    try {
        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })

        res.status(200).json({
            success : true,
            message : "Playlist Deleted Successfully",
            deletePlaylist
        })
    } catch (error) {
        console.log("Error While Deleting Playlist", error);
        res.status(500).json({
            error:"Error While Deleting Playlist"
        })
    }
}

export const removeProblemFromPlaylist = async(req, res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({
                error:"Invalid problemIds"
            })
        }

        const problemsInPlaylist = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId: playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })

        res.status(200).json({
            success : true,
            message : "Problems removed from playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.log("Error While Removing Problems from Playlist", error);
        res.status(500).json({
            error:"Error While Removing Problems from Playlist"
        })
    }
}

