---
title: HTTP Shell
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Example](#example)
-   [Commands](#commands)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

**HTTP Shell** is a tool that provides developers a modern alternative to http clients for interacting with APIs. It is developed by [SoftInstigate](https://softinstigate.com) - the company behind RESTHeart - from its long experience on API development.

{: .bs-callout.bs-callout-info}
We suggest you to use **HTTP Shell** as a developer tool to execute requests on the RESTHeart API.

You can download **HTTP Shell** binary packages for Linux, Mac and Windows from [GitHub](https://github.com/SoftInstigate/http-shell/releases)

### Example

The following commands show a typical commands usage scenario.

```
> set url http://127.0.0.1:8080

> set auth

> edit /tmp/message.json

> put messages/foo /tmp/message.json

> get messages/foo
```

- With `set url` and `set auth` we set the *base URL* and the *basic authentication* credentials to use in further requests.

- The command `edit` opens the [Monaco Editor](https://github.com/Microsoft/monaco-editor) to create the json file `message.json`.

- The following `put` command executes the `PUT` HTTP request on the URL `http://127.0.0.1:8080/messages/foo` (that is the *base URL* plus the specified resource URI), sending the request body from the file `message.json`.

- The following `get` command executes the `GET` HTTP requests respectively on the URL `http://127.0.0.1:8080/messages/foo` opening the response body in the Shell sidecar.

![HTTP Shell Image](https://github.com/SoftInstigate/http-shell/blob/master/plugins/plugin-client-default/images/httpshellImage.png?raw=true){: class="mx-auto d-block img-fluid"}

### Commands

{: .table.table-responsive}
| command | description | example
|---|---|---|
| set auth &lt;id&gt; &lt;password&gt; | opens a dialog to sets the basic authentication credentials to use in further requests | > set auth |
| reset auth | clear the basic authentication credentials | > reset auth |
| set url &lt;url&gt; | sets the base url to use in further requests | > set url http://127.0.0.1:8080 |
| get url | prints the base url | > get url |
| get &lt;uri&gt; | executes the GET request to url=&lt;base-url&gt;+&lt;uri&gt; | > get /collection |
| edit &lt;file&gt; | opens &lt;file&gt; for editing | > edit body.json |
| post &lt;uri&gt; &lt;file&gt; | executes the request POST &lt;base-url>+&lt;uri&gt;, sending the content of &lt;file&gt; as the request body | > post /collection body.json |
| put &lt;uri&gt; &lt;file&gt; | executes the request PUT &lt;base-url&gt;+&lt;uri&gt;, sending the content of &lt;file&gt; as the request body | > put /collection body.json |
| patch &lt;uri&gt; &lt;file&gt; | executes the request PATCH &lt;base-url&gt;+&lt;uri&gt;, sending the content of &lt;file&gt; as the request body | > patch /collection body.json |
| delete &lt;uri&gt; | executes the DELETE request to url=&lt;base-url&gt;+&lt;uri&gt; | > delete /collection |
| set header &lt;name&gt; &lt;value&gt; | set the header &lt;name&gt; to &lt;value&gt; | > set header If-Match 5f7f35efcb800f2502f95cb5 |
| get headers | prints the current set headers | > get headers |
| clear headers | clears the headers | > clear headers |

</div>