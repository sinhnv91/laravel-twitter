<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Twitter;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $me = Twitter::getCredentials();
        return view('home', compact('me'));

    }
}
