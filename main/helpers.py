from json import JSONEncoder, JSONDecoder
from django.db.models.query import QuerySet
import simplejson
from django.core.serializers import serialize

def jsonify(object):
    if isinstance(object, QuerySet):
        result = []
        for o in object:
            result.append(o)
        return simplejson.dumps(result)
    return simplejson.dumps(object)
