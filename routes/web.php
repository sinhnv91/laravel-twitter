<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});


Auth::routes();

Route::get('auth/{service}', 'Auth\AuthController@redirectToProvider');
Route::get('auth/{service}/callback', 'Auth\AuthController@handleProviderCallback');

Route::get('/', 'HomeController@index')->name('home');
Route::get('twitter/userTimeline', 'TwitterController@getUserTimeline');
Route::get('twitter/homeTimeline', 'TwitterController@getHomeTimeline');
Route::get('twitter/whoFollowers', 'TwitterController@getWhoFollowers');
Route::post('twitter/follow', 'TwitterController@follow');
Route::post('twitter/unFollow', 'TwitterController@unFollow');
Route::post('twitter/reTweet', 'TwitterController@reTweet');
Route::delete('twitter/undoReTweet/{id}', 'TwitterController@undoReTweet');