import warnings
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib
import matplotlib.pyplot as plt

from data_analyze.utils import *

matplotlib.rcParams['figure.figsize'] = (16.0, 12.0)
matplotlib.style.use('ggplot')

def fit(data, distribution, bins):
    # y, x = np.histogram(data, bins=bins, density=True)
    y, x = np.histogram(data, bins=bins)
    original_x = x
    bin_width = original_x[1] - original_x[0]
    x = (x + np.roll(x, -1))[:-1] / 2.0

    print(distribution.name)
    # fit dist to data
    params = distribution.fit(data)

    # Separate parts of parameters
    arg = params[:-2]
    loc = params[-2]
    scale = params[-1]

    # Calculate fitted PDF and error with fit in distribution
    pdf = distribution.pdf(x, loc=loc, scale=scale, *arg)

    """
    y_minus_pdf_square = []
    for i in range(len(y)):
        if y[i] != 0:
            y_minus_pdf_square.append((y[i] - pdf[i])**2)
            print(y[i], pdf[i])            
    sse = sum(y_minus_pdf_square) / len(y_minus_pdf_square)
    """

    data_sum = sum(y)
    sse = 0
    for i in range(len(y)):
        x1 = original_x[i]
        x2 = x1 + bin_width
        true_y = y[i]
        new_y = (distribution.cdf(x2, loc, scale) - distribution.cdf(x1, loc, scale)) * data_sum
        print(x1, x2, true_y, new_y)
        sse += (true_y - new_y)**2

    sse = (sse / len(y)) ** 0.5

    # return (arg, loc, scale, pdf, sse)
    return (arg, loc, scale, None, sse)

# Create models from data
def best_fit_distribution(data, bins=200, ax=None):
    """Model data by finding best fit distribution to data"""
    # Get histogram of original data
    y, x = np.histogram(data, bins=bins, density=True)
    x = (x + np.roll(x, -1))[:-1] / 2.0

    # Distributions to check
    """
    DISTRIBUTIONS = [
        st.alpha,st.anglit,st.arcsine,st.beta,st.betaprime,st.bradford,st.burr,st.cauchy,st.chi,st.chi2,st.cosine,
        st.dgamma,st.dweibull,st.erlang,st.expon,st.exponnorm,st.exponweib,st.exponpow,st.f,st.fatiguelife,st.fisk,
        st.foldcauchy,st.foldnorm,st.frechet_r,st.frechet_l,st.genlogistic,st.genpareto,st.gennorm,st.genexpon,
        st.genextreme,st.gausshyper,st.gamma,st.gengamma,st.genhalflogistic,st.gilbrat,st.gompertz,st.gumbel_r,
        st.gumbel_l,st.halfcauchy,st.halflogistic,st.halfnorm,st.halfgennorm,st.hypsecant,st.invgamma,st.invgauss,
        st.invweibull,st.johnsonsb,st.johnsonsu,st.ksone,st.kstwobign,st.laplace,st.levy,st.levy_l,st.levy_stable,
        st.logistic,st.loggamma,st.loglaplace,st.lognorm,st.lomax,st.maxwell,st.mielke,st.nakagami,st.ncx2,st.ncf,
        st.nct,st.norm,st.pareto,st.pearson3,st.powerlaw,st.powerlognorm,st.powernorm,st.rdist,st.reciprocal,
        st.rayleigh,st.rice,st.recipinvgauss,st.semicircular,st.t,st.triang,st.truncexpon,st.truncnorm,st.tukeylambda,
        st.uniform,st.vonmises,st.vonmises_line,st.wald,st.weibull_min,st.weibull_max,st.wrapcauchy
    ]
    """

    """
    DISTRIBUTIONS = [
        st.halfnorm, st.uniform, st.poisson, st.norm, st.multinomial, st.expon
    ]
    """

    DISTRIBUTIONS = [
        st.halfnorm, st.expon, st.poisson
    ]


    # Best holders
    best_distribution = st.norm
    best_params = (0.0, 1.0)
    best_sse = np.inf

    # Estimate distribution parameters from data
    for distribution in DISTRIBUTIONS:
        # print("fitting distribution: %s" % distribution)

        # Try to fit the distribution
        try:
            # Ignore warnings from data that can't be fit
            with warnings.catch_warnings():
                warnings.filterwarnings('ignore')
                arg, loc, scale, pdf, sse = fit(data, distribution, bins)

                # if axis pass in add to plot
                try:
                    if ax:
                        pd.Series(pdf, x).plot(ax=ax)
                    # end
                except Exception:
                    pass

                # identify if this distribution is better
                # print(distribution.name, params, sse)
                if best_sse > sse > 0:
                    best_distribution = distribution
                    best_params = (loc, scale)
                    best_sse = sse

        except Exception:
            pass

    return (best_distribution.name, best_params, best_sse)

def make_pdf(dist, params, size=10000):
    """Generate distributions's Probability Distribution Function """

    # Separate parts of parameters
    arg = params[:-2]
    loc = params[-2]
    scale = params[-1]

    # Get sane start and end points of distribution
    start = dist.ppf(0.01, *arg, loc=loc, scale=scale) if arg else dist.ppf(0.01, loc=loc, scale=scale)
    end = dist.ppf(0.99, *arg, loc=loc, scale=scale) if arg else dist.ppf(0.99, loc=loc, scale=scale)

    # Build PDF and turn into pandas Series
    x = np.linspace(start, end, size)
    y = dist.pdf(x, loc=loc, scale=scale, *arg)
    pdf = pd.Series(y, x)

    return pdf

def find_best_fit(data):

    # Load data from statsmodels datasets
    data = pd.Series(data)

    # Plot for comparison
    # plt.figure(figsize=(12,8))
    # ax = data.plot(kind='hist', bins=50, alpha=0.5)
    # Save plot limits
    # dataYLim = ax.get_ylim()

    # Find best fit distribution
    best_fit_name, best_fit_params, best_sse = best_fit_distribution(data, 200)
    return (best_fit_name, best_fit_params, best_sse)
    """
    best_dist = getattr(st, best_fit_name)

    # Update plots
    ax.set_ylim(0, 0.5)
    ax.set_title(u'El Niño sea temp.\n All Fitted Distributions')
    ax.set_xlabel(u'Temp (°C)')
    ax.set_ylabel('Frequency')

    # Make PDF with best params
    pdf = make_pdf(best_dist, best_fit_params)

    # Display
    plt.figure(figsize=(12,8))
    ax = pdf.plot(lw=2, label='PDF', legend=True)
    data.plot(kind='hist', bins=50, alpha=0.5, label='Data', legend=True, ax=ax)

    param_names = (best_dist.shapes + ', loc, scale').split(', ') if best_dist.shapes else ['loc', 'scale']
    param_str = ', '.join(['{}={:0.2f}'.format(k,v) for k,v in zip(param_names, best_fit_params)])
    dist_str = '{}({})'.format(best_fit_name, param_str)

    ax.set_title(u'El Niño sea temp. with best fit distribution \n' + dist_str)
    ax.set_xlabel(u'Temp. (°C)')
    ax.set_ylabel('Frequency')

    # plt.show()
    """

def output_summary(summary):

    OUTPUT_FILE = "sse-summary.csv"

    f = open(OUTPUT_FILE, "w")

    csv_head = ",".join(["type", "device"] + [each.name for each in distributions])
    csv_head += "\n"

    f.write(csv_head)

    for each_class in CLASSES:
        for device in devices:
            l = [each_class, device]
            for distribution in distributions:
                if device == "Apple":
                    l.append("-")
                    continue
                l.append(summary[each_class][device][distribution.name][-1])
            line = ",".join([str(x) for x in l])
            line = line + "\n"
            f.write(line)

    f.close()


if __name__ == "__main__":

    # devices = get_devices()
    devices = ["Apple", "samsung", "HUAWEI", "vivo", "google"]
    distributions = [st.halfnorm, st.expon]
    best_fits = {}
    summary = {}
    for each in CLASSES:
        summary[each] = {}
        for device in devices:
            summary[each][device] = {}
    for each_class in CLASSES:
        for device in devices:
            data = []
            for page in CLASSES[each_class]:
                tmp_data = LogRecord.objects.filter(device=device, page=page)
                tmp_data = [each.delay for each in tmp_data]
                data = data + tmp_data
            for distribution in distributions:
                try:
                    summary[each_class][device][distribution.name] = fit(data, distribution, 10)
                except Exception as e:
                    print(e)
                    summary[each_class][device][distribution.name] = "-"
            # best_fit_key = "{0}-{1}".format(each_class, device)
            # best_fits[best_fit_key] = find_best_fit(data)
            # print(best_fit_key, best_fits[best_fit_key])
    output_summary(summary)
    # save_pkl(summary, "best_fits.pkl")