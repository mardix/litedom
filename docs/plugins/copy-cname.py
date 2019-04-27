#coding:utf-8

# Define no-op plugin methods
def pre_build_page(page, context, data):
    """
    Called prior to building a page.

    :param page: The page about to be built
    :param context: The context for this page (you can modify this, but you must return it)
    :param data: The raw body for this page (you can modify this).
    :returns: Modified (or not) context and data.
    """
    return context, data


def post_build_page(page):
    """
    Called after building a page.

    :param page: The page that was just built.
    :returns: None
    """
    pass


def pre_build_static(static):
    """
    Called before building (copying to the build folder) a static file.

    :param static: The static file about to be built.
    :returns: None
    """
    pass


def post_build_static(static):
    """
    Called after building (copying to the build folder) a static file.

    :param static: The static file that was just built.
    :returns: None
    """
    pass


def pre_build(site):
    """
    Called prior to building the site, after loading configuration and plugins.

    A good time to register your externals.

    :param site: The site about to be built.
    :returns: None
    """
    pass

def post_build(site):
    """
    Called after building the site.

    :param site: The site that was just built.
    :returns: None
    """
    pass
