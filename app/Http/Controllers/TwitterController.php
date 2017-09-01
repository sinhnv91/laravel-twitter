<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Twitter;
use Cache;

class TwitterController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    //I'm Sorry, I don't have many time, i'm config default params, not config params from client and send to server
    public function getUserTimeline()
    {
        try {
            $data = Cache::remember('getUserTimeline', 5, function() {
                return Twitter::getUserTimeline(['trim_user' => 2823805141, 'exclude_replies' => false,'include_rts' => true, 'format' => 'array']);
            });
            $data = !empty($data) ? $data : [];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getHomeTimeline()
    {
        try {
            $data = Cache::remember('getHomeTimeline', 5, function() {
                return Twitter::getHomeTimeline(['count' => 10, 'format' => 'array']);
            });
            $data = !empty($data) ? $data : [];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getWhoFollowers()
    {
        try {
            $data = Twitter::getFollowers(['screen_name' => Auth::user()->name, 'count' => 5, 'format' => 'array']);
            return response()->json(isset($data['users']) ? $data['users'] : []);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function follow(Request $request)
    {
        $requestParams = $request->only('user_id');
        try {
            $data = Twitter::postFollow(['user_id' => $requestParams['user_id']]);
            Cache::forget('getUserTimeline');
            Cache::forget('getHomeTimeline');
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function unFollow(Request $request)
    {
        $requestParams = $request->only('user_id');
        try {
            $data = Twitter::postUnfollow(['user_id' => $requestParams['user_id']]);
            Cache::forget('getUserTimeline');
            Cache::forget('getHomeTimeline');
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function postTweet(Request $request)
    {
        $requestParams = $request->only('message');
        $this->validate($request, [
            'message' => 'required'
        ]);
        try {
            $data = Twitter::postTweet(['status' => $requestParams['message']]);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reTweet(Request $request)
    {
        $requestParams = $request->only('id');
        $this->validate($request, [
            'id' => 'required'
        ]);
        try {
            $data = Twitter::postRt($requestParams['id']);
            Cache::forget('getUserTimeline');
            Cache::forget('getHomeTimeline');
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function undoReTweet($id)
    {

        try {
            $data = Twitter::post('statuses/unretweet/' . $id);
            Cache::forget('getUserTimeline');
            Cache::forget('getHomeTimeline');
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}
