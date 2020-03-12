---
templateKey: blog-post
slug: hello-gatsby
title: Building a Gatsby Blog
date: "2020-03-12T21:37"
tags:
- gatsby
- react
---
First post! Trying out the [Gatsby](https://www.gatsbyjs.org/)
Static Site Generator to see what the fuss is all about
(and building out this site at the same time).

# So.. what is a static site generator?
It's essentially a dynamic site
at develop-time transformed into a static site during the build
process. There are a whole bunch of SSGs out there and Gatsby seems to
be quite popular so I'm giving it a shot. Gatsby allows you to back
the site from various *actual* backends like drupal but I'm literally
keeping it static by creating posts in vanilla markdown.

# How does everything flow?
1. Install the gatsby cli
2. Use the gatsby cli to generate a project
3. Use the cli to serve a live-reload preview locally
4. Tinker with the template/plugins etc till you're happy
5. Use the cli to build the production site
6. Deploy it to any static host. No dynamic runtime/database required.

# How do I make that even easier?
All the code for this blog sits in a git repository and linked to a
project set up on [zeit.co](https://zeit.co). Every time a commit is
pushed to master branch (or any other of your choice), zeit launches
a build and deploys the site automatically. Custom domains and SSL/TLS
(via Let's Encrypt) are handled for you.
