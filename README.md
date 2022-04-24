# AdBlock Classic

An open-source adblocker for K-Meleon. It can use AdBlock Plus filters and [rules](https://adblockplus.org/filter-cheatsheet) (including AdBlock Locus's subscriptions). The package is open-source software available under the MPL 2.0. AdBlock Classic is distributed freely, as-is, and without warranty. That said, you're welcome [visit the K-Meleon forums if you have questions or issues](http://kmeleonbrowser.org/forum/read.php?19,155958).

## About
AdBlock Classic is an open-source descendant of AdBlock Plus for Firefox. In 2015, AdBlock Lattitude was forked from AdBlock Plus for Pale Moon. Later, AdBlock Prime was forked from that extension by Binary Outcast who maintain the email client Interlink. AdBlock Classic pulls from these open-source ad-blocking extensions to create a native ad-blocker for K-Meleon. K-Meleon supports XUL-based extensions like those for classic Firefox but uses the native Windows (Win32) API to create the user interface. K-Meleon, therefore, needs a custom front-end to run extensions originally written for Firefox, Waterfox Classic, SeaMonkey, or Pale Moon.

To examine the source code simply extract the .xpi file with any archiver like 7-zip or Winzip. To recompile the extension, add the top-level directory to a .zip archive and replace the ".zip" extension with ".xpi" instead.

There are no trademark or patent restrictions on this software. The extension is covered by the MPL unless the file displays a header listing another open-source license. All visual assets are covered by the MPL. On a technical level, if you create custom versions of this extension you will want to change the "em:id" and "em:name" in the "install.rdf" file before distributing your changes. If those 2 values are left the same, it will overwrite other versions of AdBlock Classic.

The K-Meleon-specific interface changes are mostly stored in kmeleon.js. This is a special file that K-Meleon will look for in any XUL-based extension, but will be ignored by other browsers.
