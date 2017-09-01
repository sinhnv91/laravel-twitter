@extends('layouts.app')
@push('styles')
<link href="{{ asset('css/styles.css') }}" rel="stylesheet">
@endpush
@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="profileCard" data-user_id="{{ $me->id }}">
                                <a class="profileCard-bg" tabindex="-1" aria-hidden="true" rel="noopener"></a>

                                <div class="profileCard-content">

                                    <a class="profileCard-avatarLink u-inlineBlock" title="intro" tabindex="-1" aria-hidden="true" rel="noopener">
                                        <img class="profileCard-avatarImage" src="{{ $me->profile_image_url }}" alt="">
                                    </a>

                                    <div class="profileCard-userFields">
                                        <div class="profileCard-name">
                                            <a class="u-textInheritColor" rel="noopener">{{ $me->name  }}</a><span class="UserBadges"></span>
                                        </div>
                                        <span class="profileCard-screenname u-inlineBlock" dir="ltr">
                                          <a class="u-linkComplex" rel="noopener"><span class="username">@<b class="u-linkComplex-target">{{ $me->screen_name }}</b></span></a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="who-followers">
                                <h4 class="title">Who to follow</h4>
                                <div class="followers">

                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h4 class="title">My Tweets</h4>
                            <div class="my-tweets"></div>
                            <h4 class="title">Home Feed</h4>
                            <div class="tweets"></div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/tweets.js') }}"></script>
<script src="{{ asset('js/jquery.timeago.js') }}"></script>
@endpush