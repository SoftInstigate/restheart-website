---
layout: default
title: About
permalink: /docs/0.9-alt/
---

        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-9" role="main">

                    <div>
                        <!-- ngView:  --><div ng-view="" class="ng-scope"><!-- Overview -->
<h1 id="overview" class="page-header ng-scope">Overview</h1>

<!-- ngInclude: overviewWhatIsIt --><div ng-include="overviewWhatIsIt" class="ng-scope"><h2 id="what-is" class="ng-scope">What is it</h2>
<p class="lead ng-scope">RESTHeart is the REST API server for <a href="http://mongodb.org" target="_blank">mongodb</a></p>
<ul class="ng-scope">
    <li><strong>Zero development time</strong>: just start it and the data REST API is ready to use</li>
    <li><strong>CRUD operations API</strong> on your data</li>
    <li><strong>Data model operations API</strong>: create dbs, collections, indexes and the data structure</li>
    <li><strong>Super easy setup</strong> with convention over configuration approach</li>
    <li><strong>Pluggable security</strong> with User Management and ACL</li>
    <li><strong><a href="http://stateless.co/hal_specification.html" target="_blank">HAL</a></strong> hypermedia type</li>
    <li><strong>Super lightweight</strong>: pipeline architecture, ~6Mb footprint, ~200Mb RAM peek usage, starts in milliseconds,..</li>
    <li><strong>High throughput</strong>: very small overhead on mongodb performance</li>
    <li><strong>Horizontally scalable</strong>: fully stateless architecture supporting mongodb replica sets and shards</li>
    <li>Built on top of <a href="http://undertow.io/" target="_blank">undertow</a> <strong>non-blocking web server</strong></li>
    <li>Embeds the excellent <a href="http://github.com/mikekelly/hal-browser" target="_blank">HAL browser</a> by Mike Kelly (the author of the HAL specifications)</li>
    <li>Support <strong>Cross-origin resource sharing</strong> (<a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing" target="_blank">CORS</a>) so that your one page web application can deal with RESTHeart running on a different domain. In other words, CORS is an evolution of JSONP</li>
    <li>Ideal as <a href="https://angularjs.org/" target="_blank">AngularJS</a> (or any other MVW javascript framework) <strong>back-end</strong></li>
</ul></div>

<!-- ngInclude: overviewHowToRun --><div ng-include="overviewHowToRun" class="ng-scope"><div id="how-to-run" class="bs-docs-section ng-scope">
    <h2>How to run it</h2>
    <p class="lead">Just run the RESTHeart jar package with java.</p>
    <pre class="prettyprint lang-bash">
    $ <strong>java -server -jar restheart.jar</strong>
    </pre>
    <p>Optionally you can specify a <a href="#configuration">configuration file</a>.</p>
    <pre class="prettyprint lang-bash">
    $ <strong>java -server -jar restheart.jar restheart-conf.yml</strong>
    </pre>
    <div class="bs-callout bs-callout-info">
        <p>Java 1.8 is required!</p>
    </div>

    <p>Example output:</p>

    <pre class="prettyprint lang-bash">                 
    $ <strong>mongod --fork --syslog</strong>
    $ <strong>java -server -jar restheart.jar</strong>
    16:45:06.001 [main] INFO  c.s.restheart.Bootstrapper - starting restheart ********************************************
    16:45:06.005 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart version 0.9.2
    16:45:06.054 [main] INFO  c.s.restheart.Bootstrapper - initializing mongodb connection pool to 127.0.0.1:27017 
    16:45:06.058 [main] INFO  c.s.restheart.Bootstrapper - mongodb connection pool initialized
    16:45:06.343 [main] WARN  c.s.restheart.Bootstrapper - ***** no identity manager specified. authentication disabled.
    16:45:06.344 [main] WARN  c.s.restheart.Bootstrapper - ***** no access manager specified. users can do anything.
    16:45:06.490 [main] INFO  c.s.restheart.Bootstrapper - https listener bound at 0.0.0.0:4443
    16:45:06.491 [main] INFO  c.s.restheart.Bootstrapper - http listener bound at 0.0.0.0:8080
    16:45:06.492 [main] INFO  c.s.restheart.Bootstrapper - local cache enabled
    16:45:06.505 [main] INFO  c.s.restheart.Bootstrapper - url / bound to mongodb resource *
    16:45:06.595 [main] INFO  c.s.restheart.Bootstrapper - embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-1940849130771772698
    16:45:06.600 [main] INFO  c.s.restheart.Bootstrapper - url /browser bound to static resources browser. access manager: false
    16:45:06.730 [main] INFO  c.s.restheart.Bootstrapper - logging to /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
    16:45:06.730 [main] INFO  c.s.restheart.Bootstrapper - logging to console with level INFO
    16:45:06.730 [main] INFO  c.s.restheart.Bootstrapper - restheart started **********************************************
    </pre>

    <div class="bs-callout bs-callout-info">
        <p><strong>WOW, it started in less than a second!</strong></p>
    </div>

    <div class="bs-callout bs-callout-warning">
        <p>When RESTHeart starts without a configuration file, the default configuration is used:
        </p><ul>
            <li>RESTHeart serves on port 8080 (http) and 4443 (https)</li>
            <li>mongodb is supposed to be running locally at default port (27017) with authentication disabled (i.e., no --auth mongodb command line option)</li>
            <li><strong>security is disabled</strong>: any user can do anything (notice the log warning messages)</li> 
        </ul>
    </div>

    <p class="lead">
        Now poit your browser at <a href="http://127.0.0.1:8080/browser" target="_blank">http://127.0.0.1:8080/browser</a>
        and enjoy sufring the RESTHeart API with the embedded HAL browser.
    </p>

    <div class="bs-callout bs-callout-info">
        <p>
            The HAL browser allows you to surf the API with your browser.
        </p>
        <p>
            If you point your browser to a resource URL (for instance the root resource URL <a href="http://127.0.0.1:8080/" target="_blank">http://127.0.0.1:8080/</a>) RESTHeart will send back an HAL+json document. Your browser might not understand the <code>Content-Type: application/hal+json</code> and download it rather displaying it.
        </p>
    </div>

    <div class="bs-callout bs-callout-info">
        <p>
            You could use <strong>curl</strong> to deal with RESTHeart.
        </p>
        <p>
            We love the the brilliant <strong>httpie</strong> tool. If you don't have it already go <a href="http://httpie.org" target="_blank">httpie.org</a> and grab it NOW!
        </p>
    </div>

    <pre class="prettyprint lang-json">
    $ <strong>http PUT 127.0.0.1:8080/myfirstdb description="this is my first db created with RESTHeart"</strong>
    HTTP/1.1 201 Created
    Connection: keep-alive
    Content-Length: 0
    Date: Wed, 29 Oct 2014 14:02:01 GMT
                 
    $ <strong>http GET 127.0.0.1:8080</strong>
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Encoding: gzip
    Content-Length: 334
    Content-Type: application/hal+json
    Date: Wed, 29 Oct 2014 14:02:08 GMT

    {
        "_embedded": {
            "rh:db": [
                {
                    "_created_on": "2014-10-29T14:02:00Z", 
                    "_etag": "5450f358f51e38fb4e4ab99c", 
                    "_id": "myfirstdb", 
                    "_lastupdated_on": "2014-10-29T14:02:00Z", 
                    "_links": {
                        "self": {
                            "href": "/myfirstdb"
                        }
                    }, 
                    "description": "this is my first db created with RESTHeart"
                }
            ]
        }, 
    "_links": {
        "curies": [
            {
                "href": "http://www.restheart.org/docs/v0.9/#api/root/{rel}", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "rh:paging": {
            "href": "/{?page}{&amp;pagesize}", 
            "templated": true
        }, 
        "self": {
            "href": "/"
        }
    }, 
    "_returned": 1, 
    "_size": 1, 
    "_total_pages": 1
}

    
    </pre>

</div>
</div>

<!-- End Overview --></div>
                    </div>

                </div>

                <!-- sidebar -->
                <nav class="col-xs-3">
                    <div class="nav bs-docs-sidebar affix" role="complementary">
                        <ul class="nav">
                            <li>
                                <a href="#overview">Overview</a>
                                <ul class="nav">
                                    <li><a href="#/overview/what">What is</a></li>
                                    <li><a href="#/overview/run">How to run</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#configuration">Configuration</a>
                                <ul class="nav">
                                    <li><a href="#/configuration/listeners">Listeners</a></li>
                                    <li><a href="#/configuration/ssl">ssl</a></li>
                                    <li><a href="#/configuration/mongodb">mongodb</a></li>
                                    <li><a href="#/configuration/security">Security</a></li>
                                    <li><a href="#/configuration/logging">Logging</a></li>
                                    <li><a href="#/configuration/staticresources">Static resources</a></li>
                                    <li><a href="#/configuration/applicationlogic">Application logic</a></li>
                                    <li><a href="#/configuration/performance">Performances settings</a></li>
                                    <li><a href="#/configuration/example">Example</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#api">API</a>
                                <ul class="nav">
                                    <li><a href="#/api/root">root</a></li>
                                    <li><a href="#/api/db">db</a></li>
                                    <li><a href="#/api/coll">collection</a></li>
                                    <li><a href="#/api/indexes">indexes</a></li>
                                    <li><a href="#/api/doc">document</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                <!-- End sidebar -->

            </div>
            <!-- End row -->
        </div>
        <!-- End container -->

        <div class="mb15"></div>
        
        